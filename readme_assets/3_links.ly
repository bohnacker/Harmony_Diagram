
line_one = \relative c' {
  % dim → min, 3.
  <d f as>4     <d f a>    \bar "."
  
  % dim → min, 1.
  <d f as>     <f as c>   \bar "."
  
  % dim → maj, 1.
  <d f as>     <des f as> \bar "."

  % dim → maj, 3.
  <d f as>     <bes d f>  \bar "."

  % dim → dim
  <d f as>     <f as ces>  <d as' ces>  <d f ces'>  \bar "."

  % min → maj, 2.
  <d f a>      <d fis a>    \bar "."

  % min → maj, 2.
  <d f a>      <f a c>    \bar "."

  % min → aug, 2.
  <d f a>      <des f a>    \bar "."

  % maj → aug, 2.
  <d fis a>      <d fis ais>    \bar "."

  s1 s2 s4
}


\score {
  <<  
  \new Staff {
    \new Voice = "one" \time 1/4 \line_one
  }
  >>
    \layout {
    \context {
      \Staff
      \remove "Time_signature_engraver"
    }
    \context {
      \Voice
    }
    \context {
      \Score
      \override SpacingSpanner.base-shortest-duration = #(ly:make-moment 1/32)
    }
  }
}