import { useEffect, useState } from "react";

import axios from "axios";

import { useParams } from "react-router-dom";

export default function SharedNote() {

  const { shareId } = useParams();

  const [note, setNote] = useState(null);

  const fetchSharedNote = async () => {

    try {

      const res = await axios.get(
        `https://ai-notes-workspace-vafu.onrender.com/api/notes/shared/${shareId}`
      );

      setNote(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchSharedNote();

  }, []);

  if (!note) {

    return (

      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">

        <h1 className="text-3xl font-bold">
          Loading Shared Note...
        </h1>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-900 text-white p-10">

      <div className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-2xl">

        <h1 className="text-4xl font-bold mb-6">
          {note.aiSuggestedTitle || note.title}
        </h1>

        <p className="text-lg text-slate-300 whitespace-pre-wrap mb-8">
          {note.content}
        </p>

        {note.aiSummary && (

          <div className="bg-slate-700 p-6 rounded-xl">

            <h2 className="text-2xl font-bold mb-4">
              AI Summary
            </h2>

            <p className="mb-6">
              {note.aiSummary}
            </p>

            <h3 className="text-xl font-bold mb-3">
              Action Items
            </h3>

            <ul className="list-disc ml-6 space-y-2">

              {note.aiActionItems?.map(
                (item, index) => (

                  <li key={index}>
                    {item}
                  </li>
                )
              )}

            </ul>

          </div>

        )}

      </div>

    </div>
  );
}