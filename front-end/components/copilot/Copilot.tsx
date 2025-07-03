import React from 'react';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

const Copilot = () => {
  return (
    <>
      <CopilotPopup
        labels={{
          title: 'Hổ trợ CKC đào tạo',
          initial: 'Xin chào! Tôi có thể giúp bạn quản lý lịch công tác tuần.'
        }}
        instructions='Bạn là trợ lý giáo dục thông minh. Bạn có thể truy vấn database để lấy thông tin về lịch biểu, giảng viên, bộ môn. Luôn trả lời bằng tiếng Việt.'
      />
    </>
  );
};

export default Copilot;
