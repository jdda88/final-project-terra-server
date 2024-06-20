import express from "express";
import isAuth from "../middleware/authentication.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import Plan from "../models/plan.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";

const router = express.Router();

//CREATE
router.post("/", isAuth, isAdmin, async (req, res) => {
    try {
        const { title, country, cities, stats, images, content } =
        req.body;
        const planData = {
            title,
            country,
            cities,
            stats,
            images,
            content,
        };
        for (const property in planData) {
            if(!planData[property]) {
                delete planData.property;
            }
        }
        const plan = await Plan.create(planData);

        res.status(201).json({ message: "Destination post created successfully", plan });
    } catch (error) {
        console.log("error creating destination post", error);
        res.status(500).json(error);
    }
});

//GET ALL PLANS
router.get('/all', async (reg, res) => {
    try {
        const allPlans = await Plan.find().populate({
            path: "reviews",
            populate: { path: "creator" },
        });
        console.log(allPlans[0]);
        res.json(allPlans);
    } catch (error) {
        console.log("error fetching all destinations", error);
        res.status(500).json(error);
        
    }
});

//GET SINGLE PLAN BY ID
router.get("/:planId", async (req, res) => {
    try {
        const { planId } = req.params;

        const plan = await Plan.findById(planId).populate({
            path: "reviews",
            populate: { path: "creator" },
        });

        res.json(plan);
    } catch (error) {
        console.log("error fetching single desination details", plan);
    }
});


//EDIT PLAN
router.put("/:planId", isAuth, isAdmin, async (req, res) => {
    try {
        const { planId } = req.params;
        const { title, country, cities, stats, images, content } = req.body;
        const planData = {
            title,
            country,
            cities,
            stats,
            images,
            content,
        };
        for (const property in planData) {
            if(!planData[property]) {
                delete planData.property;
            }
        }
        const updated = await Plan.findByIdAndUpdate(planId, planData, {
            new: true,
            runValidators: true,
        });

        res.json({ message: "Destination post was updated successfully", updated });
    } catch (error) {
        console.log("error editing the post", error);
        res.status(500).json(error);
    }
});

//DELETE PLAN BY ID
router.delete("/:planId", isAuth, isAdmin, async (req, res) => {
    try {
        const { planId } = req.params;
        const plan = await Plan.findById(planId).populate("reviews");

    for (const review of plan.reviews) {
        await User.findByIdAndUpdate(review.creator, {
            $pull: { reviews: review._id },
        });
        await Review.findByIdAndDelete(review._id);
    }

    const deleted = await Plan.findByIdAndDelete(planId);

    res.json({
        message: deleted.title + " destination post was deleted successfully",
        deleted,
    });
    } catch (error) {
        console.log("error deleting the post", error);
        res.status(500).json(error);
    }
});

export default router;
