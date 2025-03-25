import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Landing/Landing";
import Login from "../pages/Auth/login";
import NotFound from "../pages/notFound";
import Posts from "../pages/posts";
import Register from "../pages/Auth/signup";
import Post from "../pages/viewPost";

import Chat from "../pages/chat";

import CommunityPosts from "../components/community/community-posts";
import CommunityPostView from "../components/community/community-postview";
import CommunityCreate from "../components/community/community-create";
import CommunityDiscover from "../components/community/community-discover";
import CommunitiesJoinedPage from "../components/community/community-joined";
import CommunityLayout from "../components/community/community-layout";
import CommunityView from "../components/community/community-view";
import CommunityMembers from "../components/community/community-members";
import Forget from "../pages/Auth/forget";
import ProfileLayout from "../components/layouts/profile-layout";
import Reset from "../pages/Auth/reset-password";
import TherapistPage from "../pages/therapistPage";
import VerifyUser from "../pages/Auth/verify-account";
import ProtectedRoute from "../utils/protectedRoute";
import PublicRoute from "../utils/publicRoute";
import CommunityAbout from "../components/community/CommunityAbout";
import UserBookings from "../components/bookings/userBookings";
import TherapistBookings from "../components/bookings/therapistBookings";
import AiTherapist from "../components/aiTherapist";
import AllUsers from "../components/AdminContent/AllUsers";
import Psychotherapists from "../components/AdminContent/Psychotherapists";

import MyPosts from "../components/profile/MyPosts";
import MyLikedPosts from "../components/profile/MyLikedPosts";
import Layout from "../components/layouts/Layout";
import Jounal from "../pages/Jounal";


const routes = () => {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />
      <Route
        exact
        path="/test"
        element={
          <PublicRoute>
            <Chat />
          </PublicRoute>
        }
      />
      <Route
        exact
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        exact
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        exact
        path="/forget-password"
        element={
          <PublicRoute>
            <Forget />
          </PublicRoute>
        }
      />

      <Route exact path="/verify-account" element={<VerifyUser />} />

      <Route
        exact
        path="/reset-password/:resetToken"
        element={
          <PublicRoute>
            <Reset />
          </PublicRoute>
        }
      />

      <Route
        exact
        path="/resources"
        element={
          <ProtectedRoute>
            <Layout>
              <Posts />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/resource"
        element={
          <ProtectedRoute>
            <Layout>
              <Post />
            </Layout>
          </ProtectedRoute>
        }
      />
        <Route
        exact
        path="/jounal"
        element={
          <ProtectedRoute>
            <Layout>
              <Jounal/>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <Chat />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/therapists"
        element={
          <ProtectedRoute>
            <Layout>
              <TherapistPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        exact
        path="/userbooking"
        element={
          <ProtectedRoute>
            <Layout>
              <UserBookings />
            </Layout>
          </ProtectedRoute>
        }
      />


      <Route
        exact
        path="/therapistsessions"
        element={
          <ProtectedRoute>
            <Layout>
              <TherapistBookings />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        exact
        path="/aitherapist"
        element={
          <ProtectedRoute>
            <Layout>
              <AiTherapist />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        exact
        path="/psychotherapists"
        element={
          <ProtectedRoute>
            <Layout>
              <Psychotherapists />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        exact
        path="/all-users"
        element={
          <ProtectedRoute>
            <Layout>
              <AllUsers />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/community/*"
        element={
          <ProtectedRoute>
            <CommunityLayout>
              <Routes>
                <Route index element={<CommunityDiscover />} />
                <Route path="discover" element={<CommunityDiscover />} />
                <Route path="joins" element={<CommunitiesJoinedPage />} />
                <Route path="create" element={<CommunityCreate />} />
                <Route
                  path="/:communityId/*"
                  element={
                    <CommunityView>
                      <Routes>
                        <Route index element={<CommunityPosts />} />
                        <Route path="posts" element={<CommunityPosts />} />
                        <Route path="post" element={<CommunityPostView />} />
                        <Route path="members" element={<CommunityMembers />} />
                        <Route path="media" element={<CommunityPosts />} />
                        <Route path="about" element={<CommunityAbout />} />
                      </Routes>
                    </CommunityView>
                  }
                />
              </Routes>
            </CommunityLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/*"
        element={
          <Layout>
            <ProfileLayout>
              <Routes>
                <Route index element={<MyPosts />} />
                <Route path="liked" element={<MyLikedPosts />} />
              </Routes>
            </ProfileLayout>
          </Layout>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default routes;
