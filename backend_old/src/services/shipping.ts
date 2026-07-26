
import { prisma } from '../lib/prisma';

// Mock Shipping Service
export class ShippingService {
  /**
   * Generates a shipping label and tracking number for an order.
   * Simulates calling Shiprocket/Delhivery API.
   */
  static async generateLabel(orderId: string) {
    console.log(`[ShippingService] Generating label for Order ${orderId}...`);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate mock AWB
    const awbNumber = `AWB${Math.floor(Math.random() * 1000000000)}`;
    const courierName = 'Delhivery Surface (Mock)';
    
    const shipment = await prisma.shipment.create({
      data: {
        orderId,
        awbNumber,
        courierName,
        trackingUrl: `https://mock-tracking.crochet.local/track/${awbNumber}`,
        status: 'LABEL_CREATED'
      }
    });

    // Automatically update order status to SHIPPED once label is generated
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'SHIPPED' }
    });

    console.log(`[ShippingService] Successfully generated AWB: ${awbNumber}`);
    
    return shipment;
  }
}
