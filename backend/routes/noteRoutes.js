import express from "express";

import axios from "axios";

import crypto from "crypto";

import Note from "../models/Note.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {

  try {

    const {
      tag,
      search,
    } = req.query;

    let query = {
      userId: req.user.id,
  
    };

    if (tag) {

      query.tags = tag;
    }

    let notes = await Note.find(query)
      .sort({
        updatedAt: -1,
      });

    if (search) {

      notes = notes.filter((note) =>
        (
          note.title +
          note.content
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    }

    res.json(notes);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {

  try {

    const note = await Note.create({
      ...req.body,
      userId: req.user.id,
    });

    res.json(note);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to create note",
    });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {

  try {

    const updated =
      await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(updated);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to update note",
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    await Note.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to delete note",
    });
  }
});

router.post(
  "/:id/archive",
  authMiddleware,
  async (req, res) => {

    try {

      const note =
        await Note.findById(
          req.params.id
        );

      note.archived = true;

      await note.save();

      res.json({
        message: "Archived",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Archive failed",
      });
    }
  }
);

router.post(
  "/:id/generate-summary",
  authMiddleware,
  async (req, res) => {

    try {

      const note =
        await Note.findById(
          req.params.id
        );

      const prompt = `
You are an AI assistant helping summarize notes.

Return ONLY valid JSON.

Format:

{
  "summary": "",
  "action_items": [],
  "suggested_title": ""
}

Note Content:
${note.content}
`;

      const response =
        await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model:
              "deepseek/deepseek-chat",

            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization:
                `Bearer ${process.env.OPENROUTER_API_KEY}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      const raw =
        response.data.choices[0]
          .message.content;

      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "");

      const parsed =
        JSON.parse(cleaned);

      note.aiSummary =
        parsed.summary;

      note.aiActionItems =
        parsed.action_items;

      note.aiSuggestedTitle =
        parsed.suggested_title;

      await note.save();

      res.json(parsed);

    } catch (error) {

      console.log(
        error.response?.data ||
        error
      );

      res.status(500).json({
        message:
          "AI generation failed",
      });
    }
  }
);

router.post(
  "/:id/share",
  authMiddleware,
  async (req, res) => {

    try {

      const note =
        await Note.findById(
          req.params.id
        );

      const shareId =
        crypto.randomBytes(8)
          .toString("hex");

      note.isPublic = true;

      note.shareId = shareId;

      await note.save();

      res.json({
        shareLink:
          `http://localhost:5173/shared/${shareId}`,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Share failed",
      });
    }
  }
);

router.get(
  "/shared/:shareId",
  async (req, res) => {

    try {

      const note =
        await Note.findOne({
          shareId:
            req.params.shareId,

          isPublic: true,
        });

      if (!note) {

        return res.status(404).json({
          message:
            "Note not found",
        });
      }

      res.json(note);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch shared note",
      });
    }
  }
);

router.get(
  "/stats/dashboard",
  authMiddleware,
  async (req, res) => {

    try {

      const notes =
        await Note.find({
          userId: req.user.id,
        });

      const totalNotes =
        notes.length;

      const aiGenerated =
        notes.filter(
          (note) =>
            note.aiSummary
        ).length;

      const sharedNotes =
        notes.filter(
          (note) =>
            note.isPublic
        ).length;

      const recentNotes =
        [...notes]
          .sort(
            (a, b) =>
              new Date(
                b.updatedAt
              ) -
              new Date(
                a.updatedAt
              )
          )
          .slice(0, 5);

      const tagCounts = {};

      notes.forEach((note) => {

        note.tags.forEach((tag) => {

          tagCounts[tag] =
            (tagCounts[tag] || 0) + 1;
        });
      });

      res.json({
        totalNotes,
        aiGenerated,
        sharedNotes,
        recentNotes,
        tagCounts,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch stats",
      });
    }
  }
);

export default router;