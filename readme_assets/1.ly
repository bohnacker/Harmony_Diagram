
line_one = \relative c' {
  <c e g>4 <c es g> 
}


\score {
  <<  
  \new Staff {
    \new Voice = "one" \line_one
  }
  >>
  \layout {
    \context {
      \Staff
      \remove "Time_signature_engraver"
      \remove "Bar_engraver"
      \hide Stem
    }
    \context {
      \Voice
      \override Stem.length = #0
    }
    \context {
      \Score
      \override SpacingSpanner.base-shortest-duration = #(ly:make-moment 1/16)
    }
  }
}