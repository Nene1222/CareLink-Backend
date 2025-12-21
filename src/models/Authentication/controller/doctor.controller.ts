import { Request, Response } from "express";
import Doctor from "../auth_models/Doctor";

/**
 * Create a new doctor
 */
export const createDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all doctors
 * Supports filtering by specialization, department, availability
 */
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const { specialization, department, isAvailable } = req.query;

    const filter: any = {};
    if (specialization) filter.specialization = specialization;
    if (department) filter.department = department;
    if (isAvailable !== undefined)
      filter.isAvailable = isAvailable === "true";

    const doctors = await Doctor.find(filter)
      .populate("staffDetails")
      .populate("userDetails")
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get doctor by ID
 */
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("staffDetails")
      .populate("userDetails");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get doctor by doctorCode
 */
export const getDoctorByCode = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findOne({
      doctorCode: req.params.code.toUpperCase(),
    })
      .populate("staffDetails")
      .populate("userDetails");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update doctor
 */
export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete doctor
 */
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
