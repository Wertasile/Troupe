const express = require("express");
const {
  accessChat,
  fetchChats,
  deleteChat,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../Controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();  // router gets initialised, allowing us to define routes specific to chat functionalities

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/:chatId").delete(protect, deleteChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;