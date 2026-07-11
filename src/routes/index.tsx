import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      <h1 className="text-preset-1 text-fx-lime-500 font-bold">
        Whereas disregard and contempt for human rights have resulted
      </h1>
      <p>
        No one shall be subjected to arbitrary arrest, detention or exile.
        Everyone is entitled in full equality to a fair and public hearing by an
        independent and impartial tribunal, in the determination of his rights
        and obligations and of any criminal charge against him. No one shall be
        subjected to arbitrary interference with his privacy, family, home or
        correspondence, nor to attacks upon his honour and reputation. Everyone
        has the right to the protection of the law against such interference or
        attacks.
      </p>
    </div>
  )
}
