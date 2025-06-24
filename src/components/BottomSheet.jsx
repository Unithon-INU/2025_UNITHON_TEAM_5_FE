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
          {/* <Backdrop onClick={onClose} /> */}
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
            <DragHandle $Dragging={isDragging} />
            <Content>{children}</Content>
          </Sheet>
        </>
      )}
    </AnimatePresence>
  );
}

export default BottomSheet;

// Styled Components
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
`;

const Sheet = styled(motion.div)`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 393px;
  height: 60%;
  background: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 100;
  touch-action: none;
  cursor: ${({ $dragging }) =>
    $dragging ? "grabbing" : "default"}; // ✅ 커서 반영
`;

const DragHandle = styled.div`
  width: 40px;
  height: 5px;
  background: #ccc;
  border-radius: 3px;
  margin: 8px auto;

  /* cursor: grab; */
  &:active {
    cursor: grabbing;
  }
  cursor: ${({ $dragging }) => ($dragging ? "grabbing" : "grab")};
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
