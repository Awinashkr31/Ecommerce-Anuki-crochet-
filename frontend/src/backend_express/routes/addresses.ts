import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all addresses for the authenticated user
router.get('/', verifyToken, async (req: any, res: any) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(addresses);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Add a new address
router.post('/', verifyToken, async (req: any, res: any) => {
  try {
    const { fullName, phone, pincode, city, state, address, landmark, isDefault } = req.body;

    if (!fullName || !phone || !pincode || !city || !state || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If this is set to default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    // If it's the first address, make it default automatically
    const existingCount = await prisma.address.count({ where: { userId: req.user.userId } });
    const shouldBeDefault = existingCount === 0 ? true : (isDefault || false);

    const newAddress = await prisma.address.create({
      data: {
        userId: req.user.userId,
        fullName,
        phone,
        zipCode: pincode,
        city,
        state,
        street: address,
        landmark: landmark || null,
        isDefault: shouldBeDefault,
        country: 'India'
      }
    });

    res.status(201).json(newAddress);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});

// Update an address
router.put('/:id', verifyToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { fullName, phone, pincode, city, state, address, landmark, isDefault } = req.body;

    const addressToUpdate = await prisma.address.findUnique({
      where: { id, userId: req.user.userId }
    });
    if (!addressToUpdate) return res.status(404).json({ error: 'Address not found' });

    // If making default, unset others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.userId, isDefault: true, id: { not: id } },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        fullName,
        phone,
        zipCode: pincode,
        city,
        state,
        street: address,
        landmark: landmark || null,
        isDefault
      }
    });

    res.json(updatedAddress);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete an address
router.delete('/:id', verifyToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const addressRecord = await prisma.address.findUnique({ where: { id } });
    
    if (!addressRecord || addressRecord.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await prisma.address.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

export default router;
