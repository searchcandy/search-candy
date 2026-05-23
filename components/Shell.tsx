import Header from './header'
import Footer from './footer'

export default function Shell({
  children,
  newsletter,
}: {
  children: SearchCandyReactNode
  newsletter: SearchCandyReactNode
}) {
  return (
    <>
      <Header />
      {children}
      {newsletter}
      <Footer />
    </>
  )
}
