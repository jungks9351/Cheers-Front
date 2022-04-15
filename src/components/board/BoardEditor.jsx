import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import { useMutation, useQueryClient } from 'react-query';

import * as boardAPI from 'api/board';
import StyledInput from 'components/common/StyledInput';

const BoardEditor = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(null);
  const [imgKeys, setImgKeys] = useState([]);
  const queryClient = useQueryClient();

  const editor = useRef(null);

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };

  const wrtieBoard = useMutation(boardAPI.write, {
    mutationKey: ['boards'],
    onSuccess: (data) => {
      queryClient.invalidateQueries(['boards']);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.current.getInstance().removeHook('addImageBlobHook');
    editor.current
      .getInstance()
      .addHook('addImageBlobHook', async (blob, callback) => {
        const formData = new FormData();
        formData.append('image', blob);

        const res = await boardAPI.uploadImg(formData);
        setImgKeys((imgKeys) => [...imgKeys, res.data.imgKey]);

        callback(res.data.imgUrl, 'image');
      });
  }, [editor]);

  console.log(imgKeys);

  const onSubmit = () => {
    const contents = editor.current.getInstance().getHTML();
    if (!title) {
      alert('제목을 입력해주세요');
      return;
    }

    const payload = {
      title,
      contents,
      imgKeys,
    };
    wrtieBoard.mutate(payload);
    navigate('/board?sort=recent&page=1');
  };

  const handleCancelBtn = () => {
    navigate(-1);
  };

  return (
    <BoardEditorWrapper>
      <Input
        id="boardTitle"
        type="text"
        placeholder="제목을 입력하세요."
        onChange={changeTitle}
      />
      <div className="editor-wrapper">
        <Editor
          className="editor"
          height="100%"
          previewStyle={false}
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'indent', 'outdent'],
            ['image', 'link'],
          ]}
          previewHighlight={false}
          initialEditType="wysiwyg"
          placeholder="여러분의 이야기를 자유롭게 적으세요."
          ref={editor}
        />
      </div>
      <ButtonWrapper>
        <button onClick={onSubmit} className="upload-btn">
          업로드
        </button>
        <button onClick={handleCancelBtn} className="cancle-btn">
          취소
        </button>
      </ButtonWrapper>
    </BoardEditorWrapper>
  );
};

const BoardEditorWrapper = styled.section`
  height: 100%;
  padding: 2rem 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  flex: 1;
  .editor-wrapper {
    width: 100%;
    min-height: 500px;
    flex: 1;
  }

  .toastui-editor-defaultUI {
    width: 100%;
  }
  .ProseMirror {
    background-color: ${({ theme }) => theme.color.white};
  }

  .toastui-editor-dropdown-toolbar {
    flex-direction: column;
    right: -2.1rem !important;
  }
  .toastui-editor-defaultUI-toolbar {
    padding: 0;
  }
  .toastui-editor-toolbar-group {
    border-bottom: 1px solid #dadde6;
    background-color: #f6f9fc;
  }
  .toastui-editor-popup {
    left: 50% !important;
  }
`;

const Input = styled(StyledInput)`
  border: none;
  background-color: inherit;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 2rem;

  > button {
    width: 5rem;
    font-size: 1.3rem;
    margin-right: 0.5rem;
    padding: 1rem 0;
    color: #fff;
    border-radius: 0.5rem;
    transition: 0.2s background-color;
    @media screen and (min-width: 768px) {
      width: 8rem;
      font-size: 1.5rem;
    }
  }

  .upload-btn {
    background-color: #db428e;
    &:hover {
      background-color: #c22d77;
    }
  }
  .cancle-btn {
    background-color: #ccc;
    &:hover {
      background-color: #aaa;
    }
  }
`;

export default BoardEditor;
