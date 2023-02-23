import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import _ from 'lodash';
import { ArticleRepository } from './article.repository';

@Injectable()
export class BoardService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private articleRepository: ArticleRepository,
    ) {}

    async getArticles() {
        const cachedArticles = await this.cacheManager.get('articles');
        if (!_.isNil(cachedArticles)) {
            return cachedArticles;
        }

        const articles = await this.articleRepository.find({
            where: { deletedAt: null },
            select: ['id', 'author', 'title', 'content', 'createdAt'],
        });

        await this.cacheManager.set('articles', articles);
        return articles;
    }

    async getArticleById(id: number) {
        return await this.articleRepository.find({
            where: { id, deletedAt: null },
            select: [
                'id',
                'author',
                'title',
                'content',
                'createdAt',
                'updatedAt',
            ],
        });
    }

    async getHotArticles() {
        return await this.articleRepository.getArticlesByViewCount();
    }

    async createArticle(title: string, content: string, password: number) {
        await this.articleRepository.insert({
            author: 'test',
            title,
            content,
            password: password.toString(),
        });
    }

    async updateArticle(
        id: number,
        title: string,
        content: string,
        password: number,
    ) {
        // 글 찾기
        const article = await this.articleRepository.findOne({
            where: { id, deletedAt: null },
            select: ['password'],
        });

        // 글이 null 이거나 undefined
        if (_.isNil(article)) {
            throw new NotFoundException(`Article not found. id: ${id}`);
        }

        // 글의 비밀번호가 일치하지 않을 때
        if (article.password !== password.toString()) {
            throw new UnauthorizedException(
                `Article password is not correct. id: ${id}`,
            );
        }

        await this.articleRepository.update(id, { title, content });
    }

    async deleteArticle(id: number, password: number) {
        // DRY 가능
        // 글 찾기
        const article = await this.articleRepository.findOne({
            where: { id, deletedAt: null },
            select: ['password'],
        });

        // 글이 null 이거나 undefined
        if (_.isNil(article)) {
            throw new NotFoundException(`Article not found. id: ${id}`);
        }

        // 글의 비밀번호가 일치하지 않을 때
        if (article.password !== password.toString()) {
            throw new UnauthorizedException(
                `Article password is not correct. id: ${id}`,
            );
        }

        await this.articleRepository.softDelete(id);
    }
}
