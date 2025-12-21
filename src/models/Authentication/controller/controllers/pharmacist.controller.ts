import { Request, Response } from "express";
import Pharmacist from "../../auth_models/Pharmacist";

/**
 * Create pharmacist
 */
export const createPharmacist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pharmacist = await Pharmacist.create(req.body);

    res.status(201).json({
      success: true,
      data: pharmacist,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all pharmacists
 */
export const getAllPharmacists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pharmacists = await Pharmacist.find()
      .populate("userId", "username email role");

    res.status(200).json({
      success: true,
      count: pharmacists.length,
      data: pharmacists,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get pharmacist by ID
 */
export const getPharmacistById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pharmacist = await Pharmacist.findById(req.params.id)
      .populate("userId", "username email role");

    if (!pharmacist) {
      res.status(404).json({
        success: false,
        message: "Pharmacist not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: pharmacist,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update pharmacist
 */
export const updatePharmacist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pharmacist = await Pharmacist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!pharmacist) {
      res.status(404).json({
        success: false,
        message: "Pharmacist not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: pharmacist,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete pharmacist
 */
export const deletePharmacist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pharmacist = await Pharmacist.findByIdAndDelete(req.params.id);

    if (!pharmacist) {
      res.status(404).json({
        success: false,
        message: "Pharmacist not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Pharmacist deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
