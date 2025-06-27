const mongoose = require("mongoose");
const readline = require("readline");

// MongoDB connection URI
const uri = "mongodb+srv://greatstack:greatstack123@cluster0.wbltn7z.mongodb.net/deepseek?retryWrites=true&w=majority&appName=Cluster0";

// Define User schema and model
const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Setup command line interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Main function
async function run() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const _id = await askQuestion("Enter User ID (_id): ");
    const name = await askQuestion("Enter Name: ");
    const email = await askQuestion("Enter Email: ");
    const image = await askQuestion("Enter Image URL (optional): ");

    const newUser = new User({ _id, name, email, image });

    const savedUser = await newUser.save();
    console.log("✅ User saved:", savedUser);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

run();
