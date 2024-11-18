import React from "react"
import { Attribute } from "@repo/strapi"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"

interface BlogMarkdownProps {
  component: Attribute.GetDynamicZoneValue<
    Attribute.DynamicZone<["sections.blog-markdown"]>
  >[number]
}

export function BlogMarkdown({ component }: BlogMarkdownProps) {
  const [mdxSource, setMdxSource] = React.useState<any>(null)

  React.useEffect(() => {
    const renderMDX = async () => {
      if (component.Markdown) {
        const mdxSource = await serialize(component.Markdown)
        setMdxSource(mdxSource)
      }
    }
    renderMDX()
  }, [component.Markdown])

  if (!mdxSource) return null

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote {...mdxSource} />
    </div>
  )
}
