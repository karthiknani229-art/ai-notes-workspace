import { useEffect, useState } from "react";

import axios from "axios";

export default function Dashboard() {

  const token = localStorage.getItem("token");

  const [notes, setNotes] = useState([]);

  const [stats, setStats] = useState(null);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [tags, setTags] = useState("");

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [showArchived, setShowArchived] =
    useState(false);

  const fetchNotes = async () => {

    try {

      const res = await axios.get(
        "https://ai-notes-workspace-vafu.onrender.com/api/notes",
        {
          headers: {
            authorization: token,
          },
        }
      );

      setNotes(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  const fetchStats = async () => {

    try {

      const res = await axios.get(
        "https://ai-notes-workspace-vafu.onrender.com/api/notes/stats/dashboard",
        {
          headers: {
            authorization: token,
          },
        }
      );

      setStats(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  const createOrUpdateNote = async () => {

    if (!title || !content) {

      return alert(
        "Please fill title and content"
      );
    }

    try {

      const payload = {
        title,
        content,
        tags: tags
          .split(",")
          .map((tag) =>
            tag.trim()
          )
          .filter(Boolean),
      };

      if (editingId) {

        await axios.patch(
          `https://ai-notes-workspace-vafu.onrender.com/api/notes/${editingId}`,
          payload,
          {
            headers: {
              authorization: token,
            },
          }
        );

        alert("Note Updated");

      } else {

        await axios.post(
          "https://ai-notes-workspace-vafu.onrender.com/api/notes",
          payload,
          {
            headers: {
              authorization: token,
            },
          }
        );

        alert("Note Created");
      }

      setTitle("");

      setContent("");

      setTags("");

      setEditingId(null);

      localStorage.removeItem(
        "noteDraft"
      );

      fetchNotes();

      fetchStats();

    } catch (error) {

      console.log(error);
    }
  };

  const editNote = (note) => {

    setEditingId(note._id);

    setTitle(note.title);

    setContent(note.content);

    setTags(
      note.tags?.join(", ") || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteNote = async (id) => {

    try {

      await axios.delete(
        `https://ai-notes-workspace-vafu.onrender.com/api/notes/${id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      fetchNotes();

      fetchStats();

    } catch (error) {

      console.log(error);
    }
  };

  const archiveNote = async (id) => {

    try {

      await axios.post(
        `https://ai-notes-workspace-vafu.onrender.com/api/notes/${id}/archive`,
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );

      fetchNotes();

      fetchStats();

      alert("Note Archived");

    } catch (error) {

      console.log(error);
    }
  };

  const generateSummary = async (id) => {

    try {

      await axios.post(
        `https://ai-notes-workspace-vafu.onrender.com/api/notes/${id}/generate-summary`,
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );

      fetchNotes();

      fetchStats();

      alert("AI Summary Generated");

    } catch (error) {

      console.log(error);

      alert("AI generation failed");
    }
  };

  const shareNote = async (id) => {

    try {

      const res = await axios.post(
        `https://ai-notes-workspace-vafu.onrender.com/api/notes/${id}/share`,
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );

      navigator.clipboard.writeText(
        res.data.shareLink
      );

      alert("Share link copied");

    } catch (error) {

      console.log(error);

      alert("Share failed");
    }
  };

  useEffect(() => {

    fetchNotes();

    fetchStats();

  }, []);

  useEffect(() => {

    const savedDraft =
      localStorage.getItem(
        "noteDraft"
      );

    if (savedDraft) {

      const parsed =
        JSON.parse(savedDraft);

      setTitle(parsed.title || "");

      setContent(parsed.content || "");

      setTags(parsed.tags || "");
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "noteDraft",

      JSON.stringify({
        title,
        content,
        tags,
      })
    );

  }, [title, content, tags]);

  const filteredNotes = notes
    .filter((note) =>
      showArchived
        ? note.archived
        : !note.archived
    )
    .filter((note) =>
      (
        note.title +
        note.content +
        note.tags.join(" ")
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <div className="border-b border-slate-800 bg-slate-900">

        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">
              AI Notes Workspace
            </h1>

            <p className="text-slate-400 mt-1">
              Smart collaborative AI note management
            </p>

          </div>

          <button
            onClick={() => {

              localStorage.removeItem("token");

              window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 transition-all duration-200 px-5 py-2 rounded-xl font-medium"
          >
            Logout
          </button>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-6">

        {stats && (

          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <h3 className="text-slate-400 mb-2">
                  Total Notes
                </h3>

                <p className="text-3xl font-bold">
                  {stats.totalNotes}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <h3 className="text-slate-400 mb-2">
                  AI Generated
                </h3>

                <p className="text-3xl font-bold">
                  {stats.aiGenerated}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <h3 className="text-slate-400 mb-2">
                  Shared Notes
                </h3>

                <p className="text-3xl font-bold">
                  {stats.sharedNotes}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <h3 className="text-slate-400 mb-2">
                  Recent Notes
                </h3>

                <p className="text-3xl font-bold">
                  {stats.recentNotes.length}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <h3 className="text-slate-400 mb-2">
                  Weekly Summary
                </h3>

                <p className="text-sm leading-7 text-slate-300">

                  You created{" "}

                  <span className="font-bold text-white">
                    {stats.totalNotes}
                  </span>{" "}

                  notes and used AI on{" "}

                  <span className="font-bold text-white">
                    {stats.aiGenerated}
                  </span>{" "}

                  notes this week.

                </p>

              </div>

            </div>

            {Object.keys(stats.tagCounts)
              .length > 0 && (

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8">

                <h2 className="text-2xl font-bold mb-5">
                  Most Used Tags
                </h2>

                <div className="flex flex-wrap gap-3">

                  {Object.entries(
                    stats.tagCounts
                  ).map(([tag, count]) => (

                    <div
                      key={tag}
                      className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full"
                    >
                      #{tag} ({count})
                    </div>

                  ))}

                </div>

              </div>

            )}

          </>

        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit shadow-lg">

            <h2 className="text-2xl font-bold mb-6">

              {editingId
                ? "Edit Note"
                : "Create Note"}

            </h2>

            <input
              value={title}
              placeholder="Note title"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4 outline-none focus:border-blue-500"
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <textarea
              value={content}
              placeholder="Write your thoughts..."
              rows="8"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4 outline-none focus:border-blue-500 resize-none"
              onChange={(e) =>
                setContent(e.target.value)
              }
            />

            <input
              value={tags}
              placeholder="Tags (comma separated)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 mb-5 outline-none focus:border-blue-500"
              onChange={(e) =>
                setTags(e.target.value)
              }
            />

            <button
              onClick={createOrUpdateNote}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 p-4 rounded-xl font-semibold"
            >

              {editingId
                ? "Update Note"
                : "Create Note"}

            </button>

          </div>

          <div className="lg:col-span-2">

            <div className="flex gap-3 mb-4">

              <button
                onClick={() =>
                  setShowArchived(false)
                }
                className={`px-4 py-2 rounded-xl ${
                  !showArchived
                    ? "bg-blue-600"
                    : "bg-slate-800"
                }`}
              >
                Active Notes
              </button>

              <button
                onClick={() =>
                  setShowArchived(true)
                }
                className={`px-4 py-2 rounded-xl ${
                  showArchived
                    ? "bg-blue-600"
                    : "bg-slate-800"
                }`}
              >
                Archived Notes
              </button>

            </div>

            <div className="mb-6">

              <input
                placeholder="Search notes or tags..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 outline-none focus:border-blue-500"
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="space-y-6">

              {filteredNotes.length === 0 && (

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center">

                  <h2 className="text-3xl font-bold mb-4">
                    No Notes Yet
                  </h2>

                  <p className="text-slate-400">
                    Create your first AI-powered note.
                  </p>

                </div>

              )}

              {filteredNotes.map((note) => (

                <div
                  key={note._id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-lg"
                >

                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                    <div className="flex-1">

                      <h2 className="text-3xl font-bold mb-4">
                        {note.aiSuggestedTitle || note.title}
                      </h2>

                      <div className="flex flex-wrap gap-2 mb-4">

                        {note.tags?.map(
                          (tag, index) => (

                            <span
                              key={index}
                              className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                            >
                              #{tag}
                            </span>
                          )
                        )}

                      </div>

                      <p className="text-slate-300 whitespace-pre-wrap leading-8">
                        {note.content}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3 mt-8">

                    <button
                      onClick={() =>
                        editNote(note)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 px-4 py-2 rounded-xl"
                    >
                      Edit
                    </button>

                    {!note.archived && (

                      <button
                        onClick={() =>
                          archiveNote(note._id)
                        }
                        className="bg-slate-700 hover:bg-slate-600 transition-all duration-200 px-4 py-2 rounded-xl"
                      >
                        Archive
                      </button>

                    )}

                    <button
                      onClick={() =>
                        deleteNote(note._id)
                      }
                      className="bg-red-500 hover:bg-red-600 transition-all duration-200 px-4 py-2 rounded-xl"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        generateSummary(note._id)
                      }
                      className="bg-purple-600 hover:bg-purple-700 transition-all duration-200 px-4 py-2 rounded-xl"
                    >
                      AI Summary
                    </button>

                    <button
                      onClick={() =>
                        shareNote(note._id)
                      }
                      className="bg-green-600 hover:bg-green-700 transition-all duration-200 px-4 py-2 rounded-xl"
                    >
                      Share
                    </button>

                  </div>

                  {note.aiSummary && (

                    <div className="mt-8 bg-slate-800 rounded-2xl p-6 border border-slate-700">

                      <h3 className="text-2xl font-bold mb-4">
                        AI Summary
                      </h3>

                      <p className="text-slate-300 leading-8 mb-8">
                        {note.aiSummary}
                      </p>

                      <h3 className="text-xl font-bold mb-4">
                        Action Items
                      </h3>

                      <ul className="space-y-3">

                        {note.aiActionItems?.map(
                          (item, index) => (

                            <li
                              key={index}
                              className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                            >
                              {item}
                            </li>
                          )
                        )}

                      </ul>

                    </div>

                  )}

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}