const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class CSVHandler {
  constructor() {
    this.csvPath = process.env.CSV_FILE_PATH || './data/subscribers.csv';
    this.ensureDirectoryExists();
  }

  async ensureDirectoryExists() {
    const dir = path.dirname(this.csvPath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async readSubscribers() {
    try {
      await fs.access(this.csvPath);
    } catch {
      // File doesn't exist, return empty array
      return [];
    }

    return new Promise((resolve, reject) => {
      const subscribers = [];
      const stream = require('fs').createReadStream(this.csvPath);

      stream
        .pipe(csv())
        .on('data', (row) => {
          subscribers.push(row);
        })
        .on('end', () => {
          resolve(subscribers);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async addSubscriber(subscriber) {
    const fileExists = await this.fileExists();

    const csvWriter = createCsvWriter({
      path: this.csvPath,
      header: [
        { id: 'email', title: 'email' },
        { id: 'subscribed_date', title: 'subscribed_date' },
        { id: 'subscribed_time', title: 'subscribed_time' },
        { id: 'status', title: 'status' }
      ],
      append: fileExists
    });

    await csvWriter.writeRecords([subscriber]);
  }

  async updateSubscriberStatus(email, status) {
    const subscribers = await this.readSubscribers();
    const subscriberIndex = subscribers.findIndex(
      sub => sub.email.toLowerCase() === email.toLowerCase()
    );

    if (subscriberIndex === -1) {
      return false;
    }

    subscribers[subscriberIndex].status = status;
    subscribers[subscriberIndex].updated_time = new Date().toISOString();

    // Rewrite entire CSV file
    const csvWriter = createCsvWriter({
      path: this.csvPath,
      header: [
        { id: 'email', title: 'email' },
        { id: 'subscribed_date', title: 'subscribed_date' },
        { id: 'subscribed_time', title: 'subscribed_time' },
        { id: 'status', title: 'status' },
        { id: 'updated_time', title: 'updated_time' }
      ]
    });

    await csvWriter.writeRecords(subscribers);
    return true;
  }

  async fileExists() {
    try {
      await fs.access(this.csvPath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new CSVHandler();