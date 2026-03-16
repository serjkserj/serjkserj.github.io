import React from 'react';
import OriginalDocItemContent from '@theme-original/DocItem/Content';
import DocProgress from '@site/src/components/DocProgress';

export default function DocItemContentWrapper(props) {
  return (
    <OriginalDocItemContent {...props}>
      <DocProgress />
      {props.children}
    </OriginalDocItemContent>
  );
}
