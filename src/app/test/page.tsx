export default function TestPage() {
  return (
    <div className="h-[100svh]">
      <div className="bg-red-200 flex absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="absolute right-[100%] bg-yellow-200 w-[200px]">a</div>

        <div className="bg-red-200 w-[200px]">b</div>
      <div className="absolute left-[100%] bg-blue-200 w-[200px]">c</div>
      </div>
    </div>
  )
}
