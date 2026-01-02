import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    console.log("REQ BODY 👉", data);

    // honeypot
    if (data.company) {
      return res.json({ success: true, message: "OK" });
    }

    // 🔹 поддержка разных имён полей с фронта
    const name = data.name;
    const email = data.email;
    const phone = data.phone;
    const goal = data.goal || data.purpose;
    const message = data.message || data.comment || null;

    // 🔹 чекбоксы (поддержка разных name)
    const offerRaw =
      data["offer-agreement"] ?? data.offer ?? data.offerAgreement;

    const privacyRaw =
      data["privacy-agreement"] ?? data.privacy ?? data.privacyAgreement;

    const marketingRaw =
      data["marketing-agreement"] ??
      data.marketing ??
      data.marketingAgreement;

    const offerAgreement =
      offerRaw === "on" || offerRaw === true || offerRaw === "true";

    const privacyAgreement =
      privacyRaw === "on" || privacyRaw === true || privacyRaw === "true";

    const marketingAgreement =
      marketingRaw === "on" ||
      marketingRaw === true ||
      marketingRaw === "true" ||
      false;

    // 🔴 проверка обязательных полей
    if (!name || !email || !phone || !goal || !offerAgreement || !privacyAgreement) {
      return res.status(400).json({
        success: false,
        message: "Заполните обязательные поля",
      });
    }

    // 🔹 запись в БД
    await pool.query(
      `INSERT INTO leads (
        name, email, phone, goal, message,
        offer_agreement, privacy_agreement, marketing_agreement
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        name,
        email,
        phone,
        phone.toString().replace(/\D/g, ""), // нормализация телефона
        goal,
        message,
        offerAgreement,
        privacyAgreement,
        marketingAgreement,
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


