import { Request, Response } from "express";
import Staff from "../../auth_models/Staff";

/**
 * Create a staff member
 */
export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.create(req.body);

    res.status(201).json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all staff members
 * Optional filters: status, role
 */
export const getAllStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, role } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (role) filter.role = role;

    const staffList = await Staff.find(filter).populate("user", "username email role").sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: staffList.length,
      data: staffList,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get a staff member by ID
 */
export const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findById(req.params.id).populate("user", "username email role");

    if (!staff) {
      res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update staff member
 */
export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!staff) {
      res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete staff member
 */
export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Staff member deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
