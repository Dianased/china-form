import express from "express";
import pool from "../db.js";

const router = express.Router();

// перевод значения в boolean
const toBool = (v) => v === true || v === "true" || v === "on" || v === 1;

// получение IP
const getIP = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  req.socket?.remoteAddress ||
  null;

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    console.log("REQ BODY 👉", data);

    // honeypot защита от ботов
    if (data.company) {
      return res.json({ success: true });
    }

    // основные поля
    const name = data.name;
    const email = data.email;
    const phone = data.phone;
    const goal = data.goal || data.purpose;
    const message = data.message ?? data.msg ?? null;

    // чекбоксы
    const offerAgreement = toBool(
      data["offer-agreement"] ??
      data.offer ??
      data.offerAgreement
    );

    const privacyAgreement = toBool(
      data["privacy-agreement"] ??
      data.privacy ??
      data.privacyAgreement
    );

    const marketingAgreement = toBool(
      data["marketing-agreement"] ??
      data.marketing ??
      data.marketingAgreement
    );

    // обязательные поля
    if (!name || !email || !phone || !goal || !offerAgreement || !privacyAgreement) {
      return res.status(400).json({
        success: false,
        message: "Заполните обязательные поля",
      });
    }

    // ip + user agent
    const ip = getIP(req);
    const userAgent = req.headers["user-agent"] || null;

    // запись в базу
    await pool.query(
      `INSERT INTO leads (
        name, email, phone, goal, message,
        offer_agreement, privacy_agreement, marketing_agreement,
        ip, user_agent
      ) VALUES ($1,$2,$3,$4,NULLIF($5,''),$6,$7,$8,$9,$10)`,
      [
        name,
        email,
        phone,
        goal,
        message,
        offerAgreement,
        privacyAgreement,
        marketingAgreement,
        ip,
        userAgent,
      ]
    );

    return res.json({
      success: true,
      message: "Спасибо! Заявка успешно отправлена.",
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Ошибка сервера. Попробуйте позже.",
    });
  }
});

export default router;
