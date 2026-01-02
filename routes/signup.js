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

    // 🔹 основные поля (поддержка разных имён)
    const name = data.name;
    const email = data.email;
    const phone = data.phone;
    const goal = data.goal || data.purpose;
    const message = data.message || data.comment || null;

    // 🔹 определяем ФАКТ прихода чекбоксов
    const hasOfferAgreement =
      data["offer-agreement"] !== undefined ||
      data.offer !== undefined ||
      data.offerAgreement !== undefined;

    const hasPrivacyAgreement =
      data["privacy-agreement"] !== undefined ||
      data.privacy !== undefined ||
      data.privacyAgreement !== undefined;

    // 🔹 преобразуем в boolean
    const offerAgreement =
      data["offer-agreement"] === "on" ||
      data["offer-agreement"] === "true" ||
      data.offer === true ||
      data.offerAgreement === true;

    const privacyAgreement =
      data["privacy-agreement"] === "on" ||
      data["privacy-agreement"] === "true" ||
      data.privacy === true ||
      data.privacyAgreement === true;

    const marketingAgreement =
      data["marketing-agreement"] === "on" ||
      data["marketing-agreement"] === "true" ||
      data.marketing === true ||
      data.marketingAgreement === true ||
      false;

    // 🔴 проверка обязательных полей (КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ)
    if (
      !name ||
      !email ||
      !phone ||
      !goal ||
      !hasOfferAgreement ||
      !hasPrivacyAgreement
    ) {
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
  ) VALUES ($1, $2, $3, $4, NULLIF($5, ''), $6, $7, $8)`,
      [
        name,
        email,
        phone,
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


