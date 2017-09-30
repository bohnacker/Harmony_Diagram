
line_one = \relative c' {
  <c e g>4 <c es g> 
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