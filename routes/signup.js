import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    // honeypot
    if (data.company) {
      return res.json({ success: true, message: "OK" });
    }

    // Проверяем что чекбоксы пришли (даже если значение "off" или пустое)
    const hasOfferAgreement = data["offer-agreement"] !== undefined;
    const hasPrivacyAgreement = data["privacy-agreement"] !== undefined;

    // Проверка обязательных полей
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.goal ||
      !hasOfferAgreement ||
      !hasPrivacyAgreement
    ) {
      return res.status(400).json({
        success: false,
        message: "Заполните обязательные поля",
      });
    }

    // Преобразуем чекбоксы в boolean
    const offerAgreement =
      data["offer-agreement"] === "on" ||
      data["offer-agreement"] === true ||
      data["offer-agreement"] === "true";

    const privacyAgreement =
      data["privacy-agreement"] === "on" ||
      data["privacy-agreement"] === true ||
      data["privacy-agreement"] === "true";

    const marketingAgreement =
      data["marketing-agreement"] === "on" ||
      data["marketing-agreement"] === true ||
      data["marketing-agreement"] === "true" ||
      false;

    await pool.query(
      `INSERT INTO leads (
        name, email, phone, goal, message,
        offer_agreement, privacy_agreement, marketing_agreement
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        data.name,
        data.email,
        data.phone,
        data.goal,
        data.message || null,
        offerAgreement, // используем преобразованное значение
        privacyAgreement, // используем преобразованное значение
        marketingAgreement,
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


