// ContentContext.js

import React, { createContext, useState } from 'react';

// 초기 상태 설정
const initialState = {
  title: '',
  content: '',
  selectedImage: null
};

// ContentContext 생성
export const ContentContext = createContext();

// ContentProvider 컴포넌트 정의
export const ContentProvider = ({ children }) => {
  const [savedContent, setSavedContent] = useState(initialState); // 상태와 상태 변경 함수 생성

  // Context Provider 반환
  return (
    <ContentContext.Provider value={{ savedContent, setSavedContent }}>
      {children}
    </ContentContext.Provider>
  );
};
