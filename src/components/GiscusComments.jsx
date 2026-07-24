import React from 'react';
import Giscus from '@giscus/react';

const GiscusComments = () => {
  return (
    <div className="w-full min-h-[300px]">
      <Giscus
        repo="saad001-dev/rj"
        repoId="R_kgDORUzKjQ"              // 🔥 Ye ID daal di
        category="Announcements"           // 🔥 Category name
        categoryId="DIC_xxxxxxxxx"         // 🔥 Yahan category ID daalein
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
      />
    </div>
  );
};

export default GiscusComments;