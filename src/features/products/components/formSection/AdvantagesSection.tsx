import { Trash2 } from "lucide-react";
import { Button } from "../../../../components/common/Button/Button";

interface Props {
  form: any;
  setForm: (data: any) => void;
  addAdvantageType: () => void;
  removeAdvantageType: (index: number) => void;
  addPoint: (typeIndex: number) => void;
  removePoint: (typeIndex: number, pointIndex: number) => void;
}

export function AdvantagesSection({
  form,
  setForm,
  addAdvantageType,
  removeAdvantageType,
  addPoint,
  removePoint,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Advantages</h2>

        <Button 
        onClick={addAdvantageType}>
          + Add Advantage Type
        </Button>
      </div>

      {/* Top-level media */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Advantage Image URL"
          value={form.advantages?.image || ""}
          onChange={(e) => setForm({ ...form, advantages: { ...form.advantages, image: e.target.value } })}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#eb8b1d] outline-none"
        />
        <input
          type="text"
          placeholder="Advantage Video URL"
          value={form.advantages?.video || ""}
          onChange={(e) => setForm({ ...form, advantages: { ...form.advantages, video: e.target.value } })}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#eb8b1d] outline-none"
        />
        <input
          type="text"
          placeholder="Advantage PDF URL"
          value={form.advantages?.pdf || ""}
          onChange={(e) => setForm({ ...form, advantages: { ...form.advantages, pdf: e.target.value } })}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#eb8b1d] outline-none"
        />
      </div>

      {form.advantages?.type?.length === 0 && (
        <p className="text-sm text-gray-500">No advantages added yet.</p>
      )}

      {form.advantages?.type?.map((adv: any, typeIndex: number) => (
        <div
          key={typeIndex}
          className="border border-gray-200 rounded-xl p-4 mb-4"
        >
          {/* Advantage Title */}
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Advantage Title (e.g. Energy Saving)"
              value={adv.title}
              onChange={(e) => {
                const updated = [...form.advantages.type];
                updated[typeIndex].title = e.target.value;
                setForm({ ...form, advantages: { ...form.advantages, type: updated } });
              }}
              className="flex-1 mr-4 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#eb8b1d] outline-none"
            />

            <Button
              onClick={() => removeAdvantageType(typeIndex)}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Points */}
          <div className="space-y-3">
            {adv.points?.map((point: any, pointIndex: number) => (
              <div key={pointIndex} className="border border-gray-100 rounded-lg p-3 space-y-2">
                <input
                  type="text"
                  placeholder={`Point ${pointIndex + 1} title`}
                  value={point.title}
                  onChange={(e) => {
                    const updated = [...form.advantages.type];
                    updated[typeIndex].points[pointIndex].title = e.target.value;
                    setForm({ ...form, advantages: { ...form.advantages, type: updated } });
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#eb8b1d] outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="Point description"
                  value={point.description}
                  onChange={(e) => {
                    const updated = [...form.advantages.type];
                    updated[typeIndex].points[pointIndex].description = e.target.value;
                    setForm({ ...form, advantages: { ...form.advantages, type: updated } });
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#eb8b1d] outline-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={point.image}
                    onChange={(e) => {
                      const updated = [...form.advantages.type];
                      updated[typeIndex].points[pointIndex].image = e.target.value;
                      setForm({ ...form, advantages: { ...form.advantages, type: updated } });
                    }}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#eb8b1d] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Video URL"
                    value={point.video}
                    onChange={(e) => {
                      const updated = [...form.advantages.type];
                      updated[typeIndex].points[pointIndex].video = e.target.value;
                      setForm({ ...form, advantages: { ...form.advantages, type: updated } });
                    }}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#eb8b1d] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="PDF URL"
                    value={point.pdf}
                    onChange={(e) => {
                      const updated = [...form.advantages.type];
                      updated[typeIndex].points[pointIndex].pdf = e.target.value;
                      setForm({ ...form, advantages: { ...form.advantages, type: updated } });
                    }}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#eb8b1d] outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => removePoint(typeIndex, pointIndex)}
                    className="bg-red-400 hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Point */}
          <div className="mt-4">
            <Button onClick={() => addPoint(typeIndex)}>
            + Add Point
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
