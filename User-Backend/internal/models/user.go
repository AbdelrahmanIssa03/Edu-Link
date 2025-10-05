package models

import (
	"User-Backend/api"
)

type User struct {
	ID           string
	Username     string
	Email        string
	Token        string
	RefreshToken string
}

func (u *User) FromGRPC(grpcUser *api.User) {
	if grpcUser == nil {
		return
	}

	u.ID = grpcUser.Id
	u.Username = grpcUser.Username
	u.Email = grpcUser.Email
	u.Token = grpcUser.Token
	u.RefreshToken = grpcUser.RefreshToken
}

func (u *User) ToGRPC() *api.User {
	return &api.User{
		Id:           u.ID,
		Username:     u.Username,
		Email:        u.Email,
		Token:        u.Token,
		RefreshToken: u.RefreshToken,
	}
}
