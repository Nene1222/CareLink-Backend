import { Request, Response } from "express";
import LabTechnician from "../../auth_models/LabTechnician";

/**
 * Create lab technician
 */
export const createLabTechnician = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const labTechnician = await LabTechnician.create(req.body);

    res.status(201).json({
      success: true,
      data: labTechnician,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all lab technicians
 */
export const getAllLabTechnicians = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const labTechnicians = await LabTechnician.find()
      .populate("userId", "username email role");

    res.status(200).json({
      success: true,
      count: labTechnicians.length,
      data: labTechnicians,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get lab technician by ID
 */
export const getLabTechnicianById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const labTechnician = await LabTechnician.findById(req.params.id)
      .populate("userId", "username email role");

    if (!labTechnician) {
      res.status(404).json({
        success: false,
        message: "Lab technician not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: labTechnician,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update lab technician
 */
export const updateLabTechnician = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const labTechnician = await LabTechnician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!labTechnician) {
      res.status(404).json({
        success: false,
        message: "Lab technician not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: labTechnician,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete lab technician
 */
export const deleteLabTechnician = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const labTechnician = await LabTechnician.findByIdAndDelete(req.params.id);

    if (!labTechnician) {
      res.status(404).json({
        success: false,
        message: "Lab technician not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lab technician deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
