import { CartItem } from '../types';

/**
 * Format price in Rwandan Francs
 */
export const formatPrice = (price: number, currency: string = 'RWF'): string => {
  return new Intl.NumberFormat('en-RW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' ' + currency;
};

/**
 * Get unit display name
 */
export const getUnitDisplay = (unitType: string, unitValue: number): string => {
  switch (unitType) {
    case 'grams':
      return `${unitValue}g`;
    case 'kilograms':
      return `${unitValue}kg`;
    case 'pieces':
      return `${unitValue} pc${unitValue > 1 ? 's' : ''}`;
    case 'packets':
      return `${unitValue} pkt${unitValue > 1 ? 's' : ''}`;
    default:
      return `${unitValue} ${unitType}`;
  }
};

/**
 * Generate WhatsApp order message
 */
export const generateWhatsAppMessage = (
  items: CartItem[],
  businessName: string = 'German Butchery'
): string => {
  let message = `Hello, I want to order from ${businessName}:\n\n`;

  items.forEach((item) => {
    const unitDisplay = getUnitDisplay(item.unitPrice.unitType, item.unitPrice.unitValue);
    const itemTotal = item.unitPrice.price * item.quantity;
    message += `• ${item.product.name} – ${item.quantity} × ${unitDisplay} – ${formatPrice(itemTotal)}\n`;
  });

  const total = items.reduce((sum, item) => sum + item.unitPrice.price * item.quantity, 0);
  message += `\n*Total: ${formatPrice(total)}*\n\n`;
  message += `Delivery Location: \n`;
  message += `Customer Name: `;

  return encodeURIComponent(message);
};

/**
 * Generate WhatsApp URL
 */
export const generateWhatsAppUrl = (phoneNumber: string, message: string): string => {
  // Remove non-numeric characters except +
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
  return `https://wa.me/${cleanNumber}?text=${message}`;
};
