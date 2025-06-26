'use client'
import {useEffect, useState} from 'react';
import {useActivePage} from "@toolpad/core/useActivePage";
import {Breadcrumb} from "@toolpad/core/PageContainer";
import {useParams, usePathname} from "next/navigation";
import { breadcrumbTranslations } from '@/types/general';

export function useDynamicBreadcrumbs() {
  const [breadcrumbData, setBreadcrumbData] = useState<{
    title: string;
    breadcrumbs: Breadcrumb[];
  }>({title: '', breadcrumbs: []});
  const activePage = useActivePage();
  const pathName = usePathname();
  const params = useParams();
  useEffect(() => {
    if (!activePage) return;
    const basePath = activePage.path || '';
    const fullPath = pathName || '';
    const relativePath = fullPath.replace(basePath, '');
    const processedBreadcrumbs = [
      ...activePage.breadcrumbs,
      ...relativePath
        .split('/')
        .filter(segment => segment)
        .map((segment, index, segments) => ({
          title: breadcrumbTranslations[segment] || capitalizeFirstLetter(segment.replace(/-/g, ' ')),
          path: `${basePath}/${segments.slice(0, index + 1).join('/')}`
        }))
    ].filter((item, index, arr) =>
      index === 0 || item.path !== arr[index - 1].path
    );
    const lastSegment = relativePath.split('/').pop() || '';
    console.log('lastSegment', lastSegment , 'params.id', params.id);
    const title = lastSegment === params.id
      ? `Chỉnh sửa #${params.id}`
      : breadcrumbTranslations[lastSegment] || capitalizeFirstLetter(lastSegment.replace(/-/g, ' '))

    setBreadcrumbData({
      title: title || activePage.title,
      breadcrumbs: processedBreadcrumbs
    });
  }, [pathName, params,activePage]);

  return breadcrumbData;
}

function capitalizeFirstLetter(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}