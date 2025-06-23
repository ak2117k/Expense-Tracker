# 💰 Personal Finance Tracker+

A full-stack personal finance tracker web application that helps users manage their expenses, set monthly budgets, and visualize spending trends. It also provides monthly summaries and AI-based spending suggestions.

---

## 🚀 Features

- 🔐 User Authentication (JWT + Cookie-based)
- 💸 Add, Edit, Delete Expenses
- 📆 Monthly Budget Setting + Alerts at 80% / 100%
- 📊 Dashboard with Pie & Line Charts
- 🧾 MySQL-based Monthly Reports (last 3 months)
- 🤖 Python-powered Smart Suggestions (via Pandas)
- 📱 Fully Responsive UI

---

## 📁 Tech Stack

| Layer         | Tech Stack                                  |
| ------------- | ------------------------------------------- |
| Frontend      | React (Vite) + Tailwind CSS + Redux Toolkit |
| Backend       | Node.js + Express.js                        |
| Database      | MongoDB (main), MySQL (monthly reports)     |
| Visualization | Chart.js                                    |
| Smart Logic   | Python (Flask or CLI) + Pandas              |
| Auth          | JWT (stored in cookie `jwt-user`)           |

---

## ⚙️ How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker

```

BackeEnd Setup

cd backend
npm install

Create a .env file inside /backend:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWTSECRETKEY=your_jwt_secret
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=finance_reports
NODE_ENV=development

Then run npm run dev

✨ Extra Features Added
MySQL + Cron-based monthly summaries

Budget alerts at 80% & 100%

Smart suggestions using Python + Pandas

Fully responsive layout

Secure JWT auth with cookies

📬 Want to Contribute?
Feel free to open an issue or submit a PR. Happy budgeting! 💸
