import { Request, Response } from "express";
import Nurse from "../../auth_models/Nurse";

/**
 * Create nurse
 */
export const createNurse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nurse = await Nurse.create(req.body);

    res.status(201).json({
      success: true,
      data: nurse,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all nurses
 */
export const getAllNurses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nurses = await Nurse.find()
      .populate("userId", "username email role");

    res.status(200).json({
      success: true,
      count: nurses.length,
      data: nurses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get nurse by ID
 */
export const getNurseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nurse = await Nurse.findById(req.params.id)
      .populate("userId", "username email role");

    if (!nurse) {
      res.status(404).json({
        success: false,
        message: "Nurse not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: nurse,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update nurse
 */
export const updateNurse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nurse = await Nurse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!nurse) {
      res.status(404).json({
        success: false,
        message: "Nurse not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: nurse,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete nurse
 */
export const deleteNurse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nurse = await Nurse.findByIdAndDelete(req.params.id);

    if (!nurse) {
      res.status(404).json({
        success: false,
        message: "Nurse not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Nurse deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
