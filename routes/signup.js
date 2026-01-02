import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      goal,
      message,
      company,
      "offer-agreement": offer,
      "privacy-agreement": privacy,
      "marketing-agreement": marketing,
    } = req.body;

    // honeypot
    if (company) {
      return res.json({ success: true, message: "OK" });
    }

    // обязательные поля
    if (!name || !email || !phone || !goal || !offer || !privacy) {
      return res.status(400).json({
        success: false,
        message: "Заполните обязательные поля",
      });
    }

    await pool.query(
      `
  INSERT INTO leads (
    name,
    email,
    phone,
    goal,
    message,
    offer_agreement,
    privacy_agreement,
    marketing_agreement
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  `,
      [
        name,
        email,
        phone,
        goal,
        message || null,
        offerAgreement,
        privacyAgreement,
        req.body["marketing-agreement"] === "on",
      ]
    );

    res.json({
      success: true,
      message: "Спасибо! Заявка успешно отправлена.",
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера. Попробуйте позже.",
    });
  }
});

export default router;


