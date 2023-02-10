import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {
  // service
  constructor(private readonly boardService: BoardService) {}

  // 게시물 목록을 가져오는 API
  @Get('/articles')
  getArticles() {
    return this.boardService.getArticles();
  }

  // 게시물 상세보기
  @Get('/articles/:id')
  getArticleById() {
    return this.boardService.getArticleById(id);
  }

  // 게시물 작성
  @Post('/articles')
  createArticle() {
    return this.boardService.createArticle();
  }

  // 게시물 수정
  @Put('/articles/:id')
  updateArticle() {
    return this.boardService.updateArticle(id);
  }

  // 게시물 삭제
  @Delete('/articles/:id')
  deleteArticle() {
    return this.boardService.deleteArticle(id);
  }
}
