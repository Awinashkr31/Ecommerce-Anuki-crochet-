export class NotificationService {
  /**
   * Mock sending an email
   */
  static async sendEmail(to: string, subject: string, body: string) {
    console.log(`\n================= MOCK EMAIL =================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log(`==============================================\n`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  /**
   * Mock sending an SMS
   */
  static async sendSMS(to: string, message: string) {
    console.log(`\n================== MOCK SMS ==================`);
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log(`==============================================\n`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
}
