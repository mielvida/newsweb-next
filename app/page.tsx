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

interface Category {
  id: string;
  name: string;
}

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularNews, setPopularNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setError(null);
      const url = selectedCategory 
        ? `/api/news?categoryId=${selectedCategory}`
        : '/api/news';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('뉴스 로딩 오류:', error);
      setError('뉴스를 불러오는데 실패했습니다.');
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('카테고리 로딩 오류:', error);
      setCategories([]);
    }
  }, []);

  const fetchPopularNews = useCallback(async () => {
    try {
      const response = await fetch('/api/news?limit=5');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // 조회수 기준으로 정렬
      const sorted = (data.news || []).sort((a: News, b: News) => b.views - a.views);
      setPopularNews(sorted.slice(0, 5));
    } catch (error) {
      console.error('인기 뉴스 로딩 오류:', error);
      setPopularNews([]);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    fetchCategories();
    fetchPopularNews();
  }, [fetchNews, fetchCategories, fetchPopularNews]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR');
    } catch (error) {
      return '날짜 없음';
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (!content) return '';
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">오류</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">뉴스웹</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 카테고리 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 뉴스 섹션 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name + ' 뉴스'
                : '최신 뉴스'
              }
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">뉴스가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {news.map((item) => (
                  <article key={item.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-blue-600 font-medium">
                            {item.category?.name || '카테고리 없음'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <Link href={`/news/${item.id}`}>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 mb-3">
                          {truncateContent(item.content)}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>작성자: {item.author?.name || '작성자 없음'}</span>
                          <span>조회수: {(item.views || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            {/* 인기 뉴스 */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 뉴스</h3>
              <div className="space-y-4">
                {popularNews.length === 0 ? (
                  <p className="text-gray-500 text-sm">인기 뉴스가 없습니다.</p>
                ) : (
                  popularNews.map((item, index) => (
                    <Link key={item.id} href={`/news/${item.id}`}>
                      <div className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded transition-colors">
                        <span className="text-sm font-bold text-gray-400 w-6">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            조회수 {(item.views || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* 카테고리 목록 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리</h3>
              <div className="space-y-2">
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">카테고리가 없습니다.</p>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${
                        selectedCategory === category.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
