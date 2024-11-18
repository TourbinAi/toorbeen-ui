import { NuqsAdapter } from "nuqs/adapters/next/app"

import MapForm from "./_components/mapFormContainer"

function PathFinder() {
  return (
    <NuqsAdapter>
      <MapForm />
    </NuqsAdapter>
  )
}

export default PathFinder
