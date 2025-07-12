'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface News {
  id: string;
  title: string;
  content: string;
  views: number;
  createdAt: string;
  author: { name: string };
  category: { name: string };
}

export default function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsId, setNewsId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        setNewsId(resolvedParams.id);
      } catch (error) {
        console.error('Params error:', error);
        setError('페이지 로딩에 실패했습니다.');
        setLoading(false);
      }
    };
    getParams();
  }, [params]);

  const fetchNews = useCallback(async () => {
    if (!newsId) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/news/${newsId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('뉴스를 찾을 수 없습니다.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('뉴스 로딩 오류:', error);
      setError(error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    if (newsId) {
      fetchNews();
    }
  }, [newsId, fetchNews]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '날짜 없음';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">뉴스를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">오류</h1>
          <p className="text-gray-600 mb-6">{error || '뉴스를 찾을 수 없습니다.'}</p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                뉴스웹
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                홈
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                관리자
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뉴스 상세 내용 */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 뉴스 헤더 */}
          <div className="p-8 border-b">
            <div className="flex items-center space-x-4 mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {news.category?.name || '카테고리 없음'}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(news.createdAt)}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {news.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>작성자: {news.author?.name || '작성자 없음'}</span>
              <span>조회수: {(news.views || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* 뉴스 본문 */}
          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {news.content}
              </p>
            </div>
          </div>
        </article>

        {/* 뒤로가기 버튼 */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 