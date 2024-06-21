import express from "express";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import Plan from "../models/plan.model.js";
import isAuth from "../middleware/authentication.middleware.js";
import reviewModel from "../models/review.model.js";

const router = express.Router();

//CREATE REVIEW
router.post("/:planId", isAuth, async (req, res) => {
  try {
    const { planId } = req.params;
    const { title, review } = req.body;

    const createdReview = await Review.create({
      title,
      review,
      plans: planId,
      creator: req.user._id,
    });
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { reviews: createdReview._id } },
      { new: true }
    );

    await Plan.findByIdAndUpdate(
      planId,
      { $push: { reviews: createdReview._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "Review created successfully!", createdReview });
  } catch (error) {
    console.log("error while creating review", error);
    res.status(500).json(error);
  }
});

//DELETE
router.delete("/:reviewId", isAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (review.creator.toString() !== req.user._id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this review" });
    }

    await Plan.findByIdAndUpdate(review.plans, {
      $pull: { reviews: review._id },
    });

    await User.findByIdAndUpdate(review.creator, { 
      $pull: { reviews: review._id },
    });

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "your review has been deleted successfully" });
  } catch (error) {
    console.log("error while deleting review", error);
    res.status(500).json(error);
  }
});

export default router;
