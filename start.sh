#!/bin/bash
x_start_butterscotch () {
  node index.js

  if [ $? -eq 158 ]; then
      echo "Bot was asked to restart"
      x_start_butterscotch
  else
      echo "Bot wasn't asked to restart, not restarting"
  fi
}

x_start_butterscotch