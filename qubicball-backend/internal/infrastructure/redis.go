package infrastructure

import (
	"context"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)

func NewRedisClient() *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:6379", "redis"), // Assuming redis service name in docker-compose is 'redis'
		DB:   0,                               // use default DB
	})

	if _, err := rdb.Ping(context.Background()).Result(); err != nil {
		// Log error but don't fail, maybe redis is optional or starting up
		log.Println("Failed to connect to Redis: ", err)
	}

	return rdb
}
