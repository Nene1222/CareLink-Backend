import { Request, Response } from "express";
import Role from "../../auth_models/Role";

/**
 * Create new role
 */
export const createRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await Role.create(req.body);

    res.status(201).json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all roles
 */
export const getAllRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await Role.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get role by ID
 */
export const getRoleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get role by name
 */
export const getRoleByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await Role.findOne({
      name: req.params.name.toLowerCase().trim(),
    });

    if (!role) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update role
 */
export const updateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!role) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update user count for a role (manual trigger)
 */
export const updateRoleUserCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.params;

    const count = await Role.updateUserCount(name);

    if (count === undefined) {
      res.status(404).json({
        success: false,
        message: "Role not found or failed to update user count",
      });
      return;
    }

    res.status(200).json({
      success: true,
      role: name.toLowerCase(),
      userCount: count,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete role
 */
export const deleteRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
