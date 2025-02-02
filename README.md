# Gym Management System 💪

A comprehensive **Gym Management System** designed to simplify gym operations, streamline member management, and improve user engagement. This system provides features like account management, membership tracking, and the ability to manage gym resources.

---

## 🚀 Features

### 🔑 **Authentication and Authorization**
- Secure login and sign-up system with role-based access control (`Admin` and `Member`).

### 📋 **Membership Management**
- Add, update, and delete member details.
- Track membership status (active/inactive).
- Manage subscription plans and renewals.

### 💼 **Admin Dashboard**
- Monitor gym statistics, including member count, active subscriptions.
- Add, remove or edit any user in case required.
- Remove any product if found suspecious.
- Accept or decline the sellers application to make the user a product seller.

### 🏋️‍♂️ **Training Features**

- Users can keep record for BMI just by entering their height and weight.
- The graph of the BMI progress is shown in the profile page.


### 🌐 **Responsive Design**
- Fully responsive design, accessible from desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend**: EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Express-session
- **Styling**: Custom CSS
- **Deployment**: Render

---

## 🖥️ Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gym-management-system.git
   ```

2. Navigate to the project:
   ```bash
   cd gym-management-system
   ```

3. Install dependencies:
    ``` bash 
    npm install
    ```

4. Create a .env.local file and add the following environment variables:
    ```plaintext 
    SECRET_KEY  = Your-secret-key
    DATA_BASE = "mongo db connection string"
    sessionSecret = "Your-secret-key"
    emailUser = "YourSMTPgoogle@gmail.com"
    emailPassword = "Your Password"
    ```

5. Run the development server:
    ```bash
    npm run dev
    ```

6. Open your browser and visit: `http://localhost:3000` .

---

### 🔒 **Security**
- **Role-Based Access Control**: Differentiated access for admins and members.
- **Secured Sessions**: For Session management.

### 🤝 **Contribution**
Contributions are welcome! Here's how you can help:

1. Fork the repository.
2. Create a new feature branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add feature name"
    ```
4. Push to your branch:
    ```bash
    git push origin feature-name
    ```
5. Create a pull request.

---

### 📧 **Contact**

For questions or feedback, please reach out to:

- Email: lakshya154137@gmail.com
- GitHub: Laksh078
