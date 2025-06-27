// components/BottomSheet.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const sheetVariants = {
  open: {
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  closed: {
    y: "100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

function BottomSheet({ isOpen, onClose, children }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Sheet
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragStartCapture={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              if (info.offset.y > 100) onClose();
            }}
            variants={sheetVariants}
            initial="closed"
            animate="open"
            exit="closed"
            $dragging={isDragging}
          >
            <HandleContainer $Dragging={isDragging}>
              <DragHandle />
            </HandleContainer>

            <Content>{children}</Content>
          </Sheet>
        </>
      )}
    </AnimatePresence>
  );
}

export default BottomSheet;

const Sheet = styled(motion.div)`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  height: 50%;
  background: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 100;
  touch-action: none;
  cursor: ${({ $dragging }) =>
    $dragging ? "grabbing" : "default"}; // ✅ 커서 반영

  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.2));
`;

const HandleContainer = styled.div`
  width: 100%;
  height: 1.75rem;

  display: flex;
  justify-content: center;
  align-items: center;

  /* cursor: grab; */
  &:active {
    cursor: grabbing;
  }
  cursor: ${({ $dragging }) => ($dragging ? "grabbing" : "grab")};
`;

const DragHandle = styled.div`
  width: 3.5rem;
  height: 0.5rem;
  background: #ccc;
  border-radius: 0.5rem;
`;

const Content = styled.div`
  /* display: flex;
  flex-direction: column;
  padding: 20px; */
  /* padding: 16px; */
  overflow-y: auto;
  scrollbar-width: none;
  height: calc(100% - 24px);
`;
