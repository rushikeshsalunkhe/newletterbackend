const csvHandler = require('../utils/csvHandler');
const emailService = require('../services/emailService');

class SubscriberController {
  async subscribe(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Check if email already exists
      const existingSubscribers = await csvHandler.readSubscribers();
      const isAlreadySubscribed = existingSubscribers.some(
        subscriber => subscriber.email.toLowerCase() === email.toLowerCase()
      );

      if (isAlreadySubscribed) {
        return res.status(409).json({
          success: false,
          message: 'Email is already subscribed to our newsletter'
        });
      }

      // Add subscriber to CSV
      const newSubscriber = {
        email: email.toLowerCase(),
        subscribed_date: new Date().toISOString().split('T')[0],
        subscribed_time: new Date().toISOString(),
        status: 'active'
      };

      await csvHandler.addSubscriber(newSubscriber);

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(email);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the subscription if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Successfully subscribed! Welcome email sent.',
        data: { email: newSubscriber.email, subscribed_date: newSubscriber.subscribed_date }
      });

    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process subscription. Please try again.'
      });
    }
  }

  async getAllSubscribers(req, res) {
    try {
      const subscribers = await csvHandler.readSubscribers();
      res.status(200).json({
        success: true,
        data: subscribers,
        count: subscribers.length
      });
    } catch (error) {
      console.error('Get subscribers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve subscribers'
      });
    }
  }

  async unsubscribe(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const result = await csvHandler.updateSubscriberStatus(email, 'unsubscribed');

      if (result) {
        res.status(200).json({
          success: true,
          message: 'Successfully unsubscribed'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Email not found in subscription list'
        });
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unsubscribe'
      });
    }
  }

  async exportCSV(req, res) {
    try {
      const csvPath = process.env.CSV_FILE_PATH || './data/subscribers.csv';
      res.download(csvPath, 'subscribers.csv');
    } catch (error) {
      console.error('CSV export error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export CSV'
      });
    }
  }
}

module.exports = new SubscriberController();