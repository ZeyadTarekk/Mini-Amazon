<div align="center">

[![GitHub contributors](https://img.shields.io/github/contributors/ZeyadTarekk/Mini-Amazon)](https://github.com/ZeyadTarekk/Mini-Amazon/contributors)
[![GitHub issues](https://img.shields.io/github/issues/ZeyadTarekk/Mini-Amazon)](https://github.com/ZeyadTarekk/Mini-Amazon/issues)
[![GitHub license](https://img.shields.io/github/license/ZeyadTarekk/Mini-Amazon)](https://github.com/ZeyadTarekk/Mini-Amazon/blob/master/LICENSE)
[![GitHub forks](https://img.shields.io/github/forks/ZeyadTarekk/Mini-Amazon)](https://github.com/ZeyadTarekk/Mini-Amazon/network)
[![GitHub stars](https://img.shields.io/github/stars/ZeyadTarekk/Mini-Amazon)](https://github.com/ZeyadTarekk/Mini-Amazon/stargazers)
[![GitHub Language](https://img.shields.io/github/languages/top/ZeyadTarekk/Mini-Amazon)](https://img.shields.io/github/languages/count/ZeyadTarekk/Mini-Amazon)

</div>

## 📝 Table of Contents

- [About](#about)
- [Get started](#get-started)
  - [Installation](#Install)
  - [Running](#running)
- [Technology](#tech)
- [Screenshots](#Screenshots)
- [Contributors](#Contributors)
- [License](#license)

## 📙 About <a name = "about"></a>

- A fullstack Ecommerce application.
- User can signup to create account and receive email regarding the registration.
- User can reset his password by a link sent to him through the email that is valid for 1 hour only.
- Each user has a cart and orders page.
- Each user can create products and upload an image to the product.
- Pagination is supported in the products page.
- Each user can edit or delete his products.
- Each user can generate a PDF invoice to any order he has done.
- Each user can pay to make his order to test payments enter `4242 4242 4242 4242` as a card number and any expiry date in the future to proceed with the payment.

## 🏁 Getting Started <a name = "get-started"></a>

> This is an list of needed instructions to set up your project locally, to get a local copy up and running follow these
> instructuins.

### Installation <a name = "Install"></a>

1. **_Clone the repository_**

```sh
$ git clone https://github.com/ZeyadTarekk/Mini-Amazon.git
```

2. **_Navigate to repository directory_**

```sh
$ cd Mini-Amazon
```

3. **_Install dependencies_**

```sh
npm install
```

### Running <a name = "running"></a>

1. **_Create .env file and add your environment variables_**

- `MONGODB_URI` Your MongoDB connection string like this `mongodb://localhost:27017/shop`
- `API_KEY` Sendgrid api key or contact me to get mine
- `SENDER_EMAIL` Your verified Sender email at sendgrid or contact me to get mine

2. **_Running on development mode_**

```sh
npm start
```

Open http://localhost:3000 with your browser to see the result

## 💻 Built Using <a name = "tech"></a>

- **Node.js**
- **Express.js**
- **MongoDB**
- **bcryptjs to encrypt passwords**
- **csurf to generate tokens**
- **multer to upload files (products images)**
- **nodemailer to send mails**
- **pdfkit to generate PDF invoices on each order**
- **stripe to allow payments**

## 📷 Demo Screenshots <a name = "Screenshots"></a>

<div align="center">
<h3 align='left'>Signup Email</h3>
   <img src="screenshots/s7.png">
   <hr>
<h3 align='left'>Reset password email</h3>
   <img src="screenshots/s8.png">
   <hr>
<h3 align='left'>Home Page</h3>
   <img src="screenshots/s1.png">
   <hr>
   <img src="screenshots/s2.png">
   <hr>
<h3 align='left'>Product Details</h3>
   <img src="screenshots/s4.png">
   <hr>
<h3 align='left'>User cart</h3>
   <img  src="screenshots/s3.png"></a>
   <hr>
<h3 align='left'>Confirm Order</h3>
   <img  src="screenshots/s11.png"></a>
   <hr>
<h3 align='left'>Payment</h3>
   <img  src="screenshots/s12.png"></a>
   <hr>
<h3 align='left'>Payment Success</h3>
   <img  src="screenshots/s13.png"></a>
   <hr>
<h3 align='left'>Orders</h3>
   <img  src="screenshots/s14.png"></a>
   <hr>
<h3 align='left'>Generated Invoice</h3>
   <img  src="screenshots/s15.png"></a>
   <h3 align='center'>You can see the generated PDF in data/invoices folder</h3>
   <hr>
<h3 align='left'>Admin Products</h3>
<h4 align='left'>Owner User</h4>
<img src="screenshots/s5.png"></a>
<hr>
<h4 align='left'>Another User</h4>
<img src="screenshots/s6.png"></a>
<hr>
<h3 align='left'>Create Product</h3>
   <img  src="screenshots/s9.png"></a>
   <hr>
<h3 align='left'>Edit Product</h3>
   <img  src="screenshots/s10.png"></a>
   <hr>
<h3 align='left'>Reset password</h3>
   <img  src="screenshots/s16.png"></a>
   <hr>
   <img  src="screenshots/s17.png"></a>
   <hr>

</div>

## Contributors <a name = "Contributors"></a>

<table>
  <tr>
    <td align="center">
    <a href="https://github.com/ZeyadTarekk" target="_black">
    <img src="https://avatars.githubusercontent.com/u/76125650?v=4" width="150px;" alt="Zeyad Tarek"/>
    <br />
    <sub><b>Zeyad Tarek</b></sub></a>

  </tr>
 </table>

## License <a name = "license"></a>

> This software is licensed under MIT License, See [License](https://github.com/ZeyadTarekk/Mini-Amazon/blob/main/LICENSE) for more information.
