import express from "express";
import rateLimit from "express-rate-limit";
import pool from "../db.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Слишком много запросов" },
});

router.post("/leads", limiter, async (req, res) => {
  const { name, email, phone, goal, msg, company } = req.body;

  if (company) {
    return res.json({ success: true, message: "OK" });
  }

  if (!name || !email || !phone || !goal) {
    return res.json({
      success: false,
      message: "Заполните обязательные поля",
    });
  }

  try {
    await pool.query(
      `INSERT INTO leads (name, email, phone, goal, message, ip, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [name, email, phone, goal, msg || null, req.ip, req.headers["user-agent"]]
    );

    if (process.env.TG_TOKEN && process.env.TG_CHAT) {
      const text = `📩 Новая заявка

Имя: ${name}
Телефон: ${phone}
Email: ${email}
Цель: ${goal}
Комментарий: ${msg || "-"}`;

      await fetch(
        `https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TG_CHAT,
            text,
          }),
        }
      );
    }

    res.json({
      success: true,
      message: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    });
  } catch (err) {
    console.error("LEADS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера",
    });
  }
});

export default router;
