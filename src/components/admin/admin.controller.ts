import { Request, Response } from 'express';
import { logger } from '../../config/logger.config';
import { AdminModel } from './admin.model';

const createAdmin = async (req: Request, res: Response) => {
  try {
    const admin = new AdminModel(req.body);
    const savedAdmin = await admin.save();
    res.status(201).json(savedAdmin);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await AdminModel.find();
    res.status(200).json(admins);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAdminById = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const admin = await AdminModel.findById(adminId);
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    res.status(200).json(admin);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAdminByEmail = async (req: Request, res: Response) => {
  try {
    const adminEmail = req.params.email;
    const admin = await AdminModel.findOne({ email: adminEmail });
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    res.status(200).json(admin);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateAdminById = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const updatedAdmin = await AdminModel.findByIdAndUpdate(adminId, req.body, {
      new: true,
    }); // Return the updated document
    if (!updatedAdmin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    res.status(200).json(updatedAdmin);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAdminById = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const deletedAdmin = await AdminModel.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    res.status(200).json(deletedAdmin);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  createAdmin,
  getAllAdmins,
  getAdminById,
  getAdminByEmail,
  updateAdminById,
  deleteAdminById,
};
