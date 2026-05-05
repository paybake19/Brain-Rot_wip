export default function Message({
  role,
  content
}: {
  role: "user" | "assistant"
  content: string
}) {
  return (
    <div
      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm
      ${role === "user"
        ? "ml-auto bg-white/10"
        : "mr-auto bg-white/5 text-white/80"}
      `}
    >
      {content}
    </div>
  )
}
